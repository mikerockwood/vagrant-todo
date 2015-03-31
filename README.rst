=====================================
Vagrant image for testing candidates
=====================================

Installation instructions
=========================
1) Install Vagrant (1.7.2 and up) and Oracle VirtualBox. 
2) [Optional]: adjust Vagrant file, i.e. - forwarded ports, vm memory size 
(default is 1Gb), etc.
3) Provision Vagrant machine::
    $ vagrant up 

We use Saltstack_ in masterless mode and `Salt formulas`_ for provisioning 
software inside Vagrant VM. You can override default configuration settings
in `salt/pillar/dev-server.sls` file (please refer to documentation provided 
with each formula).

.. _Saltstack: http://saltstack.com/community/ 
.. _Salt formulas: http://docs.saltstack.com/en/latest/topics/development/conventions/formulas.html

Depending on network speed and other factors provisioning process may take
5-20 min. At the end of provisioning you should get a message like the 
following::
    Summary
    -------------
    Succeeded: 36 (changed=36)
    Failed:     0
    -------------
    Total states run:     36

If any state ended with errors please submit a vagrant log output to
to your contact at Newtopia.

List of automatically installed software 
========================================

.. contents::
    :local:

``Git``
-------
Install GIT.

``Mercurial HG``
----------------
Install Mercurial HG.

``Golang``
----------
Install golang and configure GOPATH for vagrant user (default is 
GOPATH=/vagrant/golang).

``Postgres``
------------
Install Postgres server, create database 'todolist' (user/password: 
todolist/todolist).

``Redis``
---------
Install Redis server (default port is 6379).

``NodeJS and NPM``
------------------
Install nodejs, npm and bower. 
