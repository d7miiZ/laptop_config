# Check if the shell is interactive
if status is-interactive
    # Commands to run in interactive sessions can go here
end

# Set aliases
alias kssh="kitten ssh"
alias icat="kitten icat"

# Set Android environment variables
set -Ux ANDROID_HOME $HOME/Library/Android/sdk
set -Ux fish_user_paths $ANDROID_HOME/platform-tools $ANDROID_HOME/tools $ANDROID_HOME/tools/bin $ANDROID_HOME/emulator

set -Ux fish_user_paths /opt/homebrew/bin $fish_user_paths

set -Ux fish_user_paths /Applications/kitty.app/Contents/MacOS/ $fish_user_paths

# Set default system paths
set PATH /usr/local/bin /usr/bin /bin /usr/sbin /sbin $fish_user_paths

# Set JAVA_HOME
if test -d /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
    set -x JAVA_HOME /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
end

# SSH Stuff
if test -z "$SSH_AUTH_SOCK" -o ! -S "$SSH_AUTH_SOCK"
    set -Ux SSH_AUTH_SOCK (launchctl getenv SSH_AUTH_SOCK)
end

fzf_configure_bindings --directory=\ct --processes=\ck

