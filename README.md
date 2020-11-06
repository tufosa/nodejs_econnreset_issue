# nodejs_econnreset_issue
A repo to showcase the nodejs issue with ECONNRESETs

The experiment to reproduce the inconsisten behaviour is the same for all cases:

1- Launch a (TLS/clear) receiver
```
$ node src/receiver(-tls).js
```

2- Launch a (TLS/clear) sender (written in python)
```
$ python3 src/sender(-tls).js
```

You will receive 2 types of output in the receiver's console:

A- The error-free output:
```
$ node src/receiver-tls.js 
listening
NEW CONNECTION 0
RECEIVED DATA - 0
NEW CONNECTION 1
RECEIVED DATA - 1
END 0
CLOSE 0 - false
NEW CONNECTION 2
RECEIVED DATA - 2
END 1
CLOSE 1 - false
NEW CONNECTION 3
RECEIVED DATA - 3
END 2
CLOSE 2 - false
NEW CONNECTION 4
RECEIVED DATA - 4
END 3
CLOSE 3 - false
NEW CONNECTION 5
RECEIVED DATA - 5
END 4
CLOSE 4 - false
NEW CONNECTION 6
RECEIVED DATA - 6
END 5
CLOSE 5 - false
END 6
CLOSE 6 - false
NEW CONNECTION 7
RECEIVED DATA - 7
END 7
CLOSE 7 - false
NEW CONNECTION 8
RECEIVED DATA - 8
END 8
CLOSE 8 - false
NEW CONNECTION 9
RECEIVED DATA - 9
END 9
CLOSE 9 - false
```

B- The ECONNRESET output:
```
$ node src/receiver-tls.js 
listening
NEW CONNECTION 0
RECEIVED DATA - 0
END 0
CLOSE 0 - false
NEW CONNECTION 1
RECEIVED DATA - 1
END 1
CLOSE 1 - false
NEW CONNECTION 2
RECEIVED DATA - 2
ERROR 2 - Error: read ECONNRESET
CLOSE 2 - true
NEW CONNECTION 3
RECEIVED DATA - 3
END 3
CLOSE 3 - false
NEW CONNECTION 4
RECEIVED DATA - 4
END 4
CLOSE 4 - false
NEW CONNECTION 5
RECEIVED DATA - 5
ERROR 5 - Error: read ECONNRESET
CLOSE 5 - true
NEW CONNECTION 6
RECEIVED DATA - 6
ERROR 6 - Error: read ECONNRESET
CLOSE 6 - true
NEW CONNECTION 7
RECEIVED DATA - 7
ERROR 7 - Error: read ECONNRESET
CLOSE 7 - true
NEW CONNECTION 8
RECEIVED DATA - 8
ERROR 8 - Error: read ECONNRESET
CLOSE 8 - true
NEW CONNECTION 9
RECEIVED DATA - 9
ERROR 9 - Error: read ECONNRESET
CLOSE 9 - true
```

The following table show the output obtained in different cases:

|  | CLEAR | TLS |
|-|-|-|
| node 8.17.0 | A | A |
| node 12.19.0 | A | B |

So it seems like there is an inconsistency in the behaviour of sockets across
versions (TLS in node 8 and node 12 behaves different) and in the same version (v12.19.0) between TLS and clear sockets.
