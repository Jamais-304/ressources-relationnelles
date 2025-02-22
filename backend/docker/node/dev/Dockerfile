FROM node:lts

# Use build arguments for host UID and GID
ARG HOST_UID=HOST_UID
ARG HOST_GID=HOST_GID

# Ensure the group exists (avoiding conflicts)
RUN if ! getent group $HOST_GID > /dev/null; then \
        groupadd -g $HOST_GID nodegroup; \
    else \
        echo "Group with GID $HOST_GID already exists"; \
    fi && \
    \
    # Ensure the user exists with the correct UID/GID
    if id -u $HOST_UID > /dev/null 2>&1; then \
        echo "User with UID $HOST_UID already exists"; \
        usermod -g $HOST_GID -d /home/nodeuser -m node; \
    else \
        useradd -m -u $HOST_UID -g $HOST_GID nodeuser; \
    fi && \
    \
    # Ensure the home directory has the correct permissions
    chown -R $HOST_UID:$HOST_GID /home/nodeuser

USER $HOST_UID:$HOST_GID

WORKDIR /usr/src/app

# COPY --chown=$HOST_UID:$HOST_GID . .
# RUN npm ci && npm cache clean --force
# ENV PATH /usr/src/node_modules/.bin:$PATH

CMD ["npm", "run", "start"]
