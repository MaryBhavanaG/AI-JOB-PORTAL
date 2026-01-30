package com.example.demo.controller;

import com.example.demo.model.Job;
import com.example.demo.repository.JobRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
//@CrossOrigin(origins = "*")
public class JobController {

    private final JobRepository repo;

    public JobController(JobRepository repo) {
        this.repo = repo;
    }

    // ADMIN: POST JOB
    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return repo.save(job);
    }

    // USER: GET ALL JOBS
    @GetMapping
    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    // SEARCH BY SKILL
    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String skill) {
        return repo.findBySkillsContainingIgnoreCase(skill);
    }
}
