import axios from 'axios'
import { defineConfig } from 'orval'
import baseConfig from './src/configs/base'

const orvalConfig = async () => {
  const { backendDomain, frontendDomain } = baseConfig

  const [keplerPropertyBESwagger] = await Promise.all([
    axios.get(`${backendDomain}/swagger-output.json`, {
      headers: { Origin: frontendDomain }
    })
  ])

  return defineConfig({
    'kepler-property-be': {
      output: {
        mode: 'tags',
        target: 'src/api/endpoints',
        schemas: 'src/api/models',
        client: 'react-query',
        override: {
          query: {
            useQuery: true,
            useInfinite: false 
          },
          mutator: {
            path: 'src/api/mutator/custom-instance.ts',
            name: 'mainInstance'
          },
          header: () => '/* eslint-disable */\r\n',
          operations: {
            getPosts: {
              query: {
                useInfinite: true,
                useInfiniteQueryParam: 'page'
              }
            },
            postSystemBackup: {
              mutator: {
                path: 'src/api/mutator/fetch-instance.ts',
                name: 'fetchInstance'
              }
            }
          }
        }
      },
      input: {
        target: keplerPropertyBESwagger.data,
        filters: {
          tags: ['Authentication', /(((Library)|(Module)) - )?/]
        }
      }
    }
  })
}

export default orvalConfig