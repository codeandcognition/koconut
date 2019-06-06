docker rm -f codeitzapi

docker pull wkwok16/codeitz-api

# Make sure TLSCERT and TLSKEY exports are set
export CERT=/etc/letsencrypt/live/api.codeitz.com/fullchain.pem
export KEY=/etc/letsencrypt/live/api.codeitz.com/privkey.pem

# Run the new docker container
docker run -d \
--name codeitzapi \
-p 8000:8000 \
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-e CERT=$CERT \
-e KEY=$KEY \
wkwok16/codeitz-api
# -p 443:443 \
# --restart unless-stopped \

exit