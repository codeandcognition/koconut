FROM python:3.7.3-slim
WORKDIR /app
ADD . /app
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt
EXPOSE 8000
ENTRYPOINT [ "python", "run_python.py" ]
CMD [ "run_python.py" ]