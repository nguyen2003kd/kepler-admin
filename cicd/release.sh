#!/bin/bash
if [ "$check" == "[tag]" ]; then
    sed -i 's|#||g' Dockerfile
    sudo docker build -t $image_name:$tag -f Dockerfile .
    sudo docker logout registry.gitlab.com
    echo "$CI_REGISTRY_PW" | sudo docker login registry.gitlab.com -u "$CI_REGISTRY_USER" --password-stdin
    sudo docker push $image_name:$tag
    sudo docker rmi $image_name:$tag
fi
