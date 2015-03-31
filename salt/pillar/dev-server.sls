golang:
  lookup:
    version: 1.4.2
    source_hash: sha1=5020af94b52b65cc9b6f11d50a67e4bae07b0aff
    user: vagrant
    # adjust gopath according to your needs
    gopath: /vagrant/golang
nodejs:
  lookup:
    install_prefix: /usr
postgres:
  lookup:
    version: '9.4'
    databases:
      # define databases 
      todolist:
        user: todolist
        password: todolist
        extensions:
          - uuid-ossp
          - pgcrypto
    # the following two sections control postgres security
    acls:
      - ['host', 'all', 'all', '10.0.0.0/16']
    pg_conf: |
      listen_addresses = '*'

