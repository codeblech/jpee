from pyjiit import Webportal
from pyjiit.default import CAPTCHA

USERNAME = "22103171"
PASSWORD = "N5Sw64Nh56sfspC"
w = Webportal()
print(w)
s = w.student_login(USERNAME, PASSWORD, CAPTCHA)
print('login successfull')
meta = w.get_attendance_meta()
header = meta.latest_header()
sem = meta.latest_semester()

print(w.get_attendance(header, sem))
