module.exports = {
    apps: [
        {
            name: "admin-case-smeq",
            cwd: "/home/gitlab-runner/case-smeq/admin-case-smeq",
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
            out_file: "./logs/admin-case-smeq.out.log",
            error_file: "./logs/admin-case-smeq.err.log",
            merge_logs: true
        }
    ]
}