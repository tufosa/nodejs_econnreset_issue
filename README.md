# nodejs_econnreset_issue
A repo to showcase the nodejs issue with ECONNRESETs

The experiment to reproduce the inconsistent behaviour is:

1- Launch a (TLS/clear) receiver
```
$ node src/receiver(-tls).js
```

2- Launch a (TLS/clear) sender (written in python)
```
$ python3 src/sender(-tls).js
```

You will receive 2 types of output in the receiver's console:

A- The neat error-free output:
```
$ node src/receiver-tls.js 
listening
NEW CONNECTION 0
RECEIVED DATA - 0
NEW CONNECTION 1
RECEIVED DATA - 1
END 0
CLOSE 0 - false - RECEIVED: 56000000
NEW CONNECTION 2
RECEIVED DATA - 2
END 1
CLOSE 1 - false - RECEIVED: 56000000
NEW CONNECTION 3
RECEIVED DATA - 3
END 2
CLOSE 2 - false - RECEIVED: 56000000
NEW CONNECTION 4
RECEIVED DATA - 4
END 3
CLOSE 3 - false - RECEIVED: 56000000
NEW CONNECTION 5
RECEIVED DATA - 5
END 4
CLOSE 4 - false - RECEIVED: 56000000
NEW CONNECTION 6
RECEIVED DATA - 6
END 5
CLOSE 5 - false - RECEIVED: 56000000
NEW CONNECTION 7
RECEIVED DATA - 7
END 6
CLOSE 6 - false - RECEIVED: 56000000
NEW CONNECTION 8
RECEIVED DATA - 8
END 7
CLOSE 7 - false - RECEIVED: 56000000
NEW CONNECTION 9
RECEIVED DATA - 9
END 8
CLOSE 8 - false - RECEIVED: 56000000
NEW CONNECTION 10
END 10
CLOSE 10 - false - RECEIVED: 0
END 9
CLOSE 9 - false - RECEIVED: 56000000
```

B- The ECONNRESET output
```
$ node src/receiver-tls.js 
listening
NEW CONNECTION 0
RECEIVED DATA - 0
ERROR 0 - Error: read ECONNRESET
CLOSE 0 - true - RECEIVED: 55941200
NEW CONNECTION 1
RECEIVED DATA - 1
END 1
CLOSE 1 - false - RECEIVED: 55938400
NEW CONNECTION 2
RECEIVED DATA - 2
END 2
CLOSE 2 - false - RECEIVED: 55956320
NEW CONNECTION 3
RECEIVED DATA - 3
ERROR 3 - Error: read ECONNRESET
CLOSE 3 - true - RECEIVED: 55942320
NEW CONNECTION 4
RECEIVED DATA - 4
ERROR 4 - Error: read ECONNRESET
CLOSE 4 - true - RECEIVED: 55965280
NEW CONNECTION 5
RECEIVED DATA - 5
ERROR 5 - Error: read ECONNRESET
CLOSE 5 - true - RECEIVED: 55994400
NEW CONNECTION 6
RECEIVED DATA - 6
ERROR 6 - Error: read ECONNRESET
CLOSE 6 - true - RECEIVED: 55999440
NEW CONNECTION 7
RECEIVED DATA - 7
END 7
CLOSE 7 - false - RECEIVED: 55981520
NEW CONNECTION 8
RECEIVED DATA - 8
ERROR 8 - Error: read ECONNRESET
CLOSE 8 - true - RECEIVED: 55968080
NEW CONNECTION 9
RECEIVED DATA - 9
END 9
CLOSE 9 - false - RECEIVED: 55950160
NEW CONNECTION 10
END 10
CLOSE 10 - false - RECEIVED: 0
```

The following table show the output obtained in different cases:

|  | CLEAR | TLS |
|-|-|-|
| node 8.17.0 | A | A |
| node 12.19.0 | A | B |

## Other implementations of the sender

Besides python, there is also an implementation of the sender in node.js and in 
Java. The node.js sender works "out of the box", but for the Java
implementation, there are some points to take into account:

1.- Server certs and CA chain needs to be added to the JVM's cacerts:
```
keytool -trustcacerts -keystore "/jdk/jre/lib/security/cacerts" -storepass changeit -importcert -alias <alias> -file <path-to-crt-file>
```
This needs to be done with `src/certs/collector.crt`, `src/certs/centralCA.crt`
and `src/certs/rootCA.crt`.
