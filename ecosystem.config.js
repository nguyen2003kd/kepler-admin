module.exports = {
  apps: [
    {
      name: "kepler-frontend-client",
      script: "pnpm",
      args: "staging",
      cwd: "/opt/kepler/kepler-frontend-2",
      env: {
        NODE_ENV: "production",
        PORT: 3030
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M"
    }
  ]
};