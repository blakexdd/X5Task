import { AxiosResponse } from 'axios'
import fs from 'fs'

interface DownloadImageParams {
  response: AxiosResponse<any>
  path: string
}
export async function downloadImage(params: DownloadImageParams) {
  const writer = fs.createWriteStream(params.path)

  params.response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
