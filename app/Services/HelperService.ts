import { AxiosResponse } from 'axios'
import fs from 'fs'
import _ from 'lodash'
import stringify from 'fast-json-stable-stringify'
import { DateTime } from 'luxon'
import Application from '@ioc:Adonis/Core/Application'
import { join } from 'path'
import Env from '@ioc:Adonis/Core/Env'
import { ServiceNames, LogLevel } from 'Contracts/types'

export class ElkLogger {
  public static log(
    service_name: ServiceNames,
    message: string,
    payload: any = {},
    log_level: LogLevel = 'MEDIUM',
    service_reboot: boolean = false
  ) {
    const payloadObject = _.isArray(payload) || typeof payload === 'string' ? { payload } : payload
    const logObject = {
      service_name,
      logger_type: 'SERVICE_LOGGER',
      message,
      log_level,
      log_time: DateTime.local().toString(),
      service_reboot,
    }

    if (Env.get('FILE_BASED_LOGS_ENABLED', 0)) {
      const link = logObjectToFileAndGetLink('service', payloadObject)
      console.log(
        stringify(
          {
            ...logObject,
            payload: link,
          },
          //@ts-ignore
          { cycles: true }
        )
      )
    } else {
      if (Application.inProduction) {
        console.log(
          stringify(
            {
              ...payloadObject,
              ...logObject,
            },
            //@ts-ignore
            { cycles: true }
          )
        )
      } else {
        console.log(
          `[\x1b[32m${logObject.log_level} ${new Date(
            logObject.log_time
          ).toLocaleTimeString()}\x1b[0m] ${logObject.service_name}: ${logObject.message} `,
          stringify(
            {
              ...payloadObject,
            },
            //@ts-ignore
            { cycles: true }
          )
        )
      }
    }
  }

  public static error(
    service_name: ServiceNames,
    message: string,
    err: any = {},
    log_level: LogLevel = 'MEDIUM'
  ) {
    console.error(
      stringify(
        {
          error_name: err?.name,
          error_message: err?.message,
          error_trace: err?.stack,
          error_stderr: err?.stderr,
          logger_type: 'SERVICE_LOGGER',
          service_name,
          message,
          log_level,
          log_time: DateTime.local().toString(),
          err_data: err,
        },
        //@ts-ignore
        { cycles: true }
      )
    )
  }
}

export function logObjectToFileAndGetLink(filename: string, object: Object) {
  if (Env.get('FILE_BASED_LOGS_ENABLED', 0)) {
    const logDirName = join(Application.appRoot, 'logs')

    fs.mkdirSync(logDirName, { recursive: true })
    const fullFileName = join(logDirName, filename)

    /**
     * Создаем файл, если нет
     */
    if (!fs.existsSync(fullFileName)) {
      fs.writeFileSync(fullFileName, '')
    }

    /**
     * Получаем текущую позицию для записи
     */
    const currentLastLine = fs.readFileSync(fullFileName).toString().split('\n').length

    fs.appendFileSync(fullFileName, '\n' + JSON.stringify(object, null, 2))

    return `${fullFileName}:${currentLastLine + 1}:1`
  }
}

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
