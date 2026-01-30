package com.example.demo.model;

public class Job {

    private int id;
    private String title;
    private String company;
    private String skills;

    public Job(int id, String title, String company, String skills) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.skills = skills;
    }

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getSkills() { return skills; }
}
