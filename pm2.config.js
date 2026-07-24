module.exports = {
    apps: [
        {
            name: "admin-kepler-property",
            cwd: "/home/gitlab-runner/kepler-property/admin-kepler-property",
            script: "npm",
            args: "run staging",
            autorestart: true,
            watch: false,
            max_restarts: 10,
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: "staging",
                PORT: 3003,
                HOST: "0.0.0.0",
            },
            env_file: ".env",
            out_file: "./logs/admin-kepler-property.out.log",
            error_file: "./logs/admin-kepler-property.err.log",
            merge_logs: true
        }
    ]
}