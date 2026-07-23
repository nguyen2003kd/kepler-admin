#!/bin/bash
export project_name="case-smeq-admin"
export image_name="registry.gitlab.com/meu-solutions/admin-case-smeq"
export port_mapping="8108:3000"
export mount_data_folder="/mnt/data"
export mount_data_folder_eptenv="/mnt/ept_env"
export environment_name="production"
export fe_git_address="gitlab.meu-solutions.com:dangdoan/admin-case-smeq"
