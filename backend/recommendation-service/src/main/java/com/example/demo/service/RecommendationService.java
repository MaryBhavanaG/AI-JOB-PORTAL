package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.model.Job;

@Service
public class RecommendationService {

    private final List<Job> jobs = List.of(
        new Job(1, "Java Developer", "XYZ Solutions", "java spring mysql"),
        new Job(2, "Python Developer", "ABC Corp", "python django flask"),
        new Job(3, "Frontend Developer", "WebWorks", "html css javascript"),
        new Job(4, "AI Engineer", "NextGen AI", "python machine learning"),
        new Job(5, "DevOps Engineer", "CloudNet", "aws docker kubernetes")
    );

    public List<Job> recommendJobs(String resumeText) {
        String text = resumeText.toLowerCase();

        return jobs.stream()
                .filter(j -> text.contains(j.getSkills().split(" ")[0]))
                .collect(Collectors.toList());
    }
}
