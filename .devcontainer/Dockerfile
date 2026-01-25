# BFIN Frontend - Dev Container Dockerfile
# Dockerfile customizado para desenvolvimento (opcional)

ARG VARIANT="20-bullseye"
FROM mcr.microsoft.com/devcontainers/typescript-node:1-${VARIANT}

# Build arguments
ARG NODE_VERSION=20

# Install additional packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        # Git for version control
        git \
        # Build tools for native dependencies
        build-essential \
        # Python for node-gyp
        python3 \
        # Additional tools
        curl \
        wget \
        unzip \
        vim \
        nano \
        jq \
        # For file watching in large projects
        inotify-tools \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Set up node user
USER node

# Configure npm global directory
RUN mkdir -p /home/node/.npm-global \
    && npm config set prefix /home/node/.npm-global \
    && echo 'export PATH=/home/node/.npm-global/bin:$PATH' >> /home/node/.bashrc

# Install global npm packages that are commonly used
RUN npm install -g \
    # TypeScript compiler
    typescript \
    # Type checking
    tsc \
    # Package management
    npm-check-updates \
    # Development tools
    nodemon \
    # Serve for static files
    serve \
    # JSON processing
    fx

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && sudo apt update \
    && sudo apt install gh -y

# Set up workspace
WORKDIR /workspaces/bfin-frotend

# Configure git safe directory (will be overridden by setup script)
RUN git config --global --add safe.directory /workspaces/bfin-frotend

# Create useful aliases
RUN echo 'alias ll="ls -alF"' >> /home/node/.bashrc \
    && echo 'alias la="ls -A"' >> /home/node/.bashrc \
    && echo 'alias l="ls -CF"' >> /home/node/.bashrc \
    && echo 'alias ..="cd .."' >> /home/node/.bashrc \
    && echo 'alias ...="cd ../.."' >> /home/node/.bashrc \
    && echo 'alias grep="grep --color=auto"' >> /home/node/.bashrc \
    && echo 'alias fgrep="fgrep --color=auto"' >> /home/node/.bashrc \
    && echo 'alias egrep="egrep --color=auto"' >> /home/node/.bashrc

# Configure shell prompt
RUN echo 'export PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]$ "' >> /home/node/.bashrc

# Create directories for volumes
RUN mkdir -p /home/node/.npm \
    && mkdir -p /workspaces/bfin-frotend/node_modules

# Set proper ownership
RUN sudo chown -R node:node /home/node/.npm \
    && sudo chown -R node:node /home/node/.npm-global

# Configure file watching limits for large projects
RUN echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Default command
CMD ["sleep", "infinity"]