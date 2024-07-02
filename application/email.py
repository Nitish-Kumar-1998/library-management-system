# importing the required libraries

import smtplib                        
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
SMTP_SERVER_HOST="localhost"                                 # SMTP server host
SMTP_SERVER_PORT=1025                                        # SMTP server port
SENDER_ADDRESS='library@yahoo.com'                           # Sender's email address
SENDER_PASSWORD=''                                           # Sender's email password



def send_email_user(to,sub,message,file=None):                    # function to send email to user          
    massage=MIMEMultipart()                                       # creating a MIMEMultipart object
    massage['From']=SENDER_ADDRESS                                # setting the sender's email address
    massage['To']=to                                              # setting the receiver's email address
    massage['Subject']=sub                                        # setting the subject of the email
    massage.attach(MIMEText(message,"html"))                      # attaching the message to the email

    if not file==None:                                           
        with open(file, 'rb') as f:
            attach = MIMEApplication(f.read(), _subtype='zip')
            attach.add_header('Content-Disposition', 'attachment', filename=file)
            massage.attach(attach)
    
    s=smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)                  # creating an SMTP object
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)                                      # login to the SMTP server
    s.send_message(massage)                                                      # sending the email
    s.quit()                                                                     # quitting the SMTP server
    return True                                                                  # returning True if email is sent successfully