#!/bin/sh

OS="$(uname -s)"

if [ $OS = "Darwin" ]; then
  prog="ytmd-tpplugin-macos"
else
  prog="ytmd-tpplugin-linux"
fi

echo "Using: $prog"
chmod +x "$prog"
pid=`ps -ef | grep -v grep | grep -i "\./${prog}" | awk '{print $2}'`

if [ -n "$pid" ]; then
	echo "$(date): (pid $pid) - ${prog} already running, killing it and restarting..."
  kill -9 "$pid"
	sleep 1
fi

"./$prog" "$@" > "${prog}log.txt" 2>&1 &
