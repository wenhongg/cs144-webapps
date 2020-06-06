//Read lines from the file of edges
val lines = sc.textFile("twitter.edges")
//Get multiple lines with multiple accounts in each line
val followed = lines.map(line => line.split(": ").last)
//Get many accounts in a single map
val accs = followed.flatMap(line => line.split(","))
//Sum words up
val acc1s = accs.map(word => (word, 1))
val accCounts = acc1s.reduceByKey((a,b) => a+b)

//Select only accounts
val accOutput = accCounts.filter(kv => kv._2>1000)

accOutput.saveAsTextFile("output")
System.exit(0)



/*
138134695: 62902439,15224867
229906813: 48024605,132179558,53820704,17378488,135741105,103365202,114043408,14803701,84121240,17874544,756278,14497313
145739229: 7861312,14230524,174729114,78982926,23871118,16700878,54285787,14643449,36981972,16162631 
*/