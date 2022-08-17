#!/usr/bin/env bash
export DOLLAR='$'
envsubst < /etc/nginx/conf.d/status-checker.template > /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"