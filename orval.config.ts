import axios from 'axios'
import { defineConfig } from 'orval'
import { config as loadEnv } from 'dotenv'

loadEnv()

const orvalConfig = async () => {
  const { default: baseConfig } = await import('./src/configs/base')
  const { backendDomain, frontendDomain } = baseConfig

  const [keplerProperty] = await Promise.all([
    axios.get(`${backendDomain}/swagger-output.json`, {
      headers: { Origin: frontendDomain }
    })
  ])

  return defineConfig({
    'kepler': {
      output: {
        mode: 'tags',
        target: 'src/api/endpoints',
        schemas: 'src/api/models',
        client: 'react-query',
        override: {
          query: {
            version: 5,
            useQuery: true,
            useInfinite: true
          },
          mutator: {
            path: 'src/api/mutator/custom-instance.ts',
            name: 'mainInstance'
          },
        }
      },
      input: {
        target: keplerProperty.data,
        filters: {
          tags: ['Authentication', /(((Library)|(Module)) - )?/]
        }
      }
    }
  })
}

export default orvalConfig