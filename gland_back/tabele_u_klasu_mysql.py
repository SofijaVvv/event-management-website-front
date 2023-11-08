import subprocess
from sqlalchemy import create_engine
from sqlalchemy import inspect


# Konverzija struktue baze u klase SQLAlchemy
class STRUKTURABAZE:
    def __init__(self):
        self.konektor = 'mysql+pymysql://root:@localhost/'
        self.sqlacodegen = 'sqlacodegen'

    def sqlmodeltabele(self, sql_baza, sql_tabela):
        komanda = self.sqlacodegen + ' {2}{0} --tables {1}'.format(sql_baza, sql_tabela, self.konektor)
        try:
            proc = subprocess.check_output(komanda, shell=True)
        except Exception as e:
            print('Ne postoji ta tabela', str(e))
        else:
            t = proc.decode().split('\n', 9)  # [9]
            print(t)
            proc = t[8] + '\n' + t[9]
            return '{0}'.format(proc)

    def spisaktabelabaze(self, sql_baza):
        db = create_engine(self.konektor + sql_baza)
        inspector = inspect(db)
        # return (json.dumps(inspector.get_table_names()))
        return inspector.get_table_names()


# test
baza = 'gland'
# vrsta = 'listatabela'
tabela = 'dogadjaji_troskovi'
# vrsta = 'model'
a = STRUKTURABAZE()
print(a.sqlmodeltabele(baza, tabela))
# print(a.spisaktabelabaze(baza))
del a
