import { getInstance } from "../ApyClient";
import { checkMissingParams } from "../utils/checkMissingParams";
import { checkParamTypes } from "../utils/checkParamsTypes";
import { getFormData } from "../utils/getFormData";
import { handleEndPoint } from "../utils/handleEndpoint";
import { isFileOrUrl } from "../utils/isFileOrUrl";

/**
 *
 * Resizes an image.
 * @param {Object} options - The options for the function.
 * @param {(string|Buffer)} options.input - The input image as a file path or URL, or as a Buffer if it is a file.
 * @param {"url"|"file"} options.responseFormat - The desired response format. Can be either "url" or "file".
 * @param {number} options.height - The desired height of the output image.
 * @param {number} options.width - The desired width of the output image.
 * @param {string} [options.output] - The desired file name for the output image. Default is "output.png".
 * @returns {Promise<{data: string}|undefined>} - A promise that resolves to an object with the resized image as a URL or file, or undefined if the response format is invalid.
 * @example
 */

async function resize({
  input,
  responseFormat,
  height,
  width,
  output,
}: {
  input: string | Buffer;
  responseFormat: "url" | "file";
  height: number;
  width: number;
  output?: string;
}): Promise<{ data: string } | undefined> {
  const client = getInstance();
  checkMissingParams({ input, responseFormat, height, width });
  checkParamTypes({ responseFormat }, ["file", "url"]);

  const inputType = isFileOrUrl(input);

  const requestUrl = `https://api.apyhub.com/processor/image/${handleEndPoint(
    "resize",
    inputType,
    responseFormat
  )}?output=${output ?? "output.png"}&height=${height}&width=${width}`;

  return await client.request(
    "post",
    requestUrl,
    inputType === "file" ? getFormData(input, "image") : { url: input }
  );
}

export { resize };
