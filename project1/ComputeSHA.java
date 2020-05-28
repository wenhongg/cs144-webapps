import java.security.MessageDigest;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ComputeSHA {

	public static String hashSHA(String string){
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			byte[] bytes = md.digest(string.getBytes());
			BigInteger bg = new BigInteger(1, bytes); 
			String data = bg.toString(16);

			while(data.length()<32)
				data = "0" + data;
			return data;
		} catch(Exception e){
			e.printStackTrace();
		}
		return null;
	} 

	public static void main(String[] args){
		if(args.length!=1){
			System.out.println("Please provide filename.");
			System.exit(1);
		}
		try {
			String filename = args[0];
			String text = new String(Files.readAllBytes(Paths.get(filename)));
			System.out.println(hashSHA(text));
		} catch(Exception e){
			e.printStackTrace();
		}
	}
}