module.exports = {
  apps: [
    {
      name: "kepler-frontend-admin",
      script: "pnpm",
      args: "staging",
      cwd: "/opt/kepler/kepler-frontend-admin",
      env: {
        NODE_ENV: "production",
        PORT: 3031
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M"
    }
  ]
}