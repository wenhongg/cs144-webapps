import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import wenhong.project2.PostEntry;

public class SQLHandler {
    Connection c;
    public SQLHandler(){
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
            return;
        }
    }

    /*
        for OPEN
        returns: title, body
    */
    public String[] findPost(String username, int postid){
        Connection c = null;
        PreparedStatement ps = null;
        ResultSet rs = null; 

        String[] data = null;
        try {
            //Get connection
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");

            //Prepare statement
            ps = c.prepareStatement("SELECT * FROM Posts WHERE username=? AND postid=?");
            ps.setString(1, username);
            ps.setInt(2, postid);

            rs = ps.executeQuery();

            //set in data if exists: ASSUMES there is only one response
            if(rs.next()){
                data = new String[2];
                data[0] = rs.getString("title");
                data[1] = rs.getString("body");
            }

        } catch(SQLException e){
            //error handling
            System.out.println("SQLException caught.");
            e.printStackTrace();
        } finally {
            //just need to close all
            try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { ps.close(); } catch (Exception e) { /* ignored */ }
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }

        return data;
    }

    //returns list value on successful deletion, else returns null
    public List<PostEntry> deletePost(String username, int postid){
        Connection c = null;
        PreparedStatement ps = null; 

        boolean ret = true;
        try {
            //Get connection
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");

            //Prepare statement
            ps = c.prepareStatement("DELETE FROM Posts WHERE username=? AND postid=?");
            ps.setString(1, username);
            ps.setInt(2, postid);

            int changed = ps.executeUpdate();

        } catch(SQLException e){
            //error handling
            System.out.println("SQLException caught.");
            e.printStackTrace();
        } finally {
            //just need to close all
            try { ps.close(); } catch (Exception e) { /* ignored */ }
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }
        return findList(username);
    }

    //returns list value on successful save, else returns null
    public List<PostEntry> savePost(String username, int postid, String title, String body){
        Connection c = null;
        PreparedStatement ps = null; 
        ResultSet rs = null;

        boolean ret = true;

        //check if postid exists.
        if(postid>0 && findPost(username, postid)==null){
            return null;
        }
        try {
            //Get connection
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");
            int changed;
            if(postid>0){
                //UPDATE
                System.out.println("update post!");
                ps = c.prepareStatement("UPDATE Posts SET title=?, body=?, modified=? WHERE username=? AND postid=?");
                ps.setString(1, title);
                ps.setString(2, body);
                ps.setTimestamp(3, new Timestamp(System.currentTimeMillis())); //set modified to current time
                ps.setString(4, username);
                ps.setInt(5, postid);

                changed = ps.executeUpdate();
            }
            else {
                //get largest postid and add 1 to get newID

                System.out.println("new post!");
                ps = c.prepareStatement("SELECT MAX(postid) FROM Posts WHERE username=?");
                ps.setString(1, username);

                rs = ps.executeQuery();
                int newID = 1;
                if(rs.next()){
                    newID = rs.getInt(1) + 1;
                }
                ps.close();

                ps = c.prepareStatement("INSERT INTO Posts (username, postid, title, body, modified, created) VALUES(?,?,?,?,?,?)");
                ps.setString(1, username);
                ps.setInt(2, newID);
                ps.setString(3, title);
                ps.setString(4, body);
                ps.setTimestamp(5, new Timestamp(System.currentTimeMillis())); //set modified to current time
                ps.setTimestamp(6, new Timestamp(System.currentTimeMillis())); //set created to current time
                
                changed = ps.executeUpdate();
            }

            if(changed==0){
                ret = false;
            }

        } catch(SQLException e){
            //error handling
            System.out.println("SQLException caught.");
            e.printStackTrace();
        } finally {
            //just need to close all
            try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { ps.close(); } catch (Exception e) { /* ignored */ }
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }

        //return list data
        if(ret)
            return findList(username);
        else
            return null;
    }

    //will never return null, just an empty list.
    public List<PostEntry> findList(String username){
        Connection c = null;
        PreparedStatement ps = null;
        ResultSet rs = null; 

        List<PostEntry> data = new ArrayList<PostEntry>();
        try {
            //Get connection
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");

            //Prepare statement
            ps = c.prepareStatement("SELECT * FROM Posts WHERE username=?");
            ps.setString(1, username);

            rs = ps.executeQuery();

            //set in data if exists: ASSUMES there is only one response
            while(rs.next()){
                String title = rs.getString("title");
                Timestamp created = rs.getTimestamp("created");
                Timestamp modified = rs.getTimestamp("modified");
                int postid = rs.getInt("postid"); //conversion to string, need to convert back
                
                PostEntry pe = new PostEntry(title, created, modified, postid);

                data.add(pe);
            }

        } catch(SQLException e){
            //error handling
            System.out.println("SQLException caught.");
            e.printStackTrace();
        } finally {
            //just need to close all
            try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { ps.close(); } catch (Exception e) { /* ignored */ }
            try { c.close(); } catch (Exception e) { /* ignored */ }
        }

        return data;
    }
}