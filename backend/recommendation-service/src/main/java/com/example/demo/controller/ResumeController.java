package com.example.demo.controller;

import java.util.List;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Job;
import com.example.demo.service.RecommendationService;

@RestController
@RequestMapping("/recommendations")
//@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/upload")
    public List<Job> uploadResume(@RequestParam("resume") MultipartFile file) throws Exception {

        Tika tika = new Tika();
        String resumeText = tika.parseToString(file.getInputStream());

        return recommendationService.recommendJobs(resumeText);
    }
}
