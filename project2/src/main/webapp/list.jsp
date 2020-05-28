<%@page import="wenhong.project2.PostEntry"%> 
<%@page import="java.util.List"%> 
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>List</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <form action="post" method="post" class="top_form">
        <input type="hidden" name="username" value='<%= request.getParameter("username") %>'>
        <input type="hidden" name="postid" value='0'>
        <button type="submit" name="action" value="open">New post</button>
    </form>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Modified</th>
            <th>&nbsp;</th>
        </tr>
        <% List<PostEntry> entries = (List<PostEntry>) request.getAttribute("list"); %>
        <% for(PostEntry pe : entries){ %>
        <tr>
            <td><%= pe.title %></td>
            <td><%= pe.getCreated() %></td>
            <td><%= pe.getModified() %></td>
            <td>
                <form action="post" method="post" id='<%= pe.postid %>'>
                    <input type="hidden" name="username" value='<%= request.getParameter("username") %>'>
                    <input type="hidden" name="postid" value='<%= pe.postid %>'>
                    <button type="submit" name="action" value="open">Open</button>
                    <button type="submit" name="action" value="delete">Delete</button>
                </form>
            </td>
        </tr>
        <% } %>
    </table>
</body>
</html>
