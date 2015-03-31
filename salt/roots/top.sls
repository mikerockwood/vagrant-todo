base:
  '*':
    - vim.nerdtree
    - vim.salt
    - git
    - base.mercurial
    - base.screen
    - base.wget
    - base.lsof
    - base.selinux.tools
  'roles:dev-server':
    - match: grain  
    - postgres
    - postgres.contrib
    - golang
    - nodejs.npm
    - nodejs.bower
    - redis
