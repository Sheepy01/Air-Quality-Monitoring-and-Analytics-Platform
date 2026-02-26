# FORCE PyMySQL before Django loads DB backend
import pymysql

pymysql.version_info = (2, 2, 1, "final", 0)
pymysql.install_as_MySQLdb()