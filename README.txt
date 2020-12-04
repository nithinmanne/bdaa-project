Project
Naga Nithin Manne


The main goal of my project is implementing a paper trading software.
A user can create an account, on the site, then he can select a date to
buy stocks on, then sell them on a different date to analyse what the
benifit would be. I felt that this system is very useful especially
to practice stock trading. Also its more focussed on the frontend,
as I have not implemented any Javascript code before, so I wanted
to implement something fairly complex so I can learn.

I implemented it the load balancers as:
http://mpcs53014-loadbalancer-217964685.us-east-2.elb.amazonaws.com:3002/
http://ec2-3-15-219-66.us-east-2.compute.amazonaws.com:3002/


Run Instructions:
node app.js <Port> <HBase Host> <HBase Port> <Kafka Brokers>
