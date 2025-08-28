const resumeContainer = document.getElementById("resume-container");

const addSummary = document.querySelector('[data-section="summary"]');
const addEducation = document.querySelector('[data-section="education"]');
const addProject = document.querySelector('[data-section="project"]');
const addExperience = document.querySelector('[data-section="experience"]');
const addSkills = document.querySelector('[data-section="skills"]');
const addVolunteer = document.querySelector('[data-section="volunteer"]');

addSummary.addEventListener("click", () => {
  resumeContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="section-card resume-section" data-type="summary">
                            <div class="section-header">
                                <div class="section-title">
                                    
                                    <h4>Summary of Qualifications</h4>
                                </div>
                                <div class="section-controls">
                                    <label class="must-include">
                                        <input type="checkbox" class="must-include-checkbox">
                                        <span class="checkmark"></span>
                                        Must Include
                                    </label>
                                    <button class="remove-section">×</button>
                                </div>
                            </div>
                            
                            <div class="bullet-points">
                                <div class="bullet-point">
                                    <textarea 
                                        placeholder="Describe your key qualification..."
                                        maxlength="300"
                                        rows="2"
                                    ></textarea>
                                    <button class="remove-bullet">×</button>
                                    <div class="bullet-limit">1-7 bullet points</div>
                                </div>
                            </div>
                            
                            <button class="add-bullet-btn">
                                <span class="plus-icon">+</span>
                                
                            </button>
                        </div>`
  );
});
addEducation.addEventListener("click", () => {
  resumeContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="section-card resume-section" data-type="education">
            <div class="section-header">
                <div class="section-title">
                    <h4>Education</h4>
                </div>
                <div class="section-controls">
                    <label class="must-include">
                        <input type="checkbox" class="must-include-checkbox">
                        <span class="checkmark"></span>
                        Must Include
                    </label>
                    <button class="remove-section">×</button>
                </div>
            </div>

            <div class="resume-fields">
                <div class="input-group">
                    <label>Institution Name *</label>
                    <input type="text" maxlength="100" placeholder="School Name">
                </div>

                <div class="input-group">
                    <label>Name of Degree</label>
                    <input type="text" maxlength="100" placeholder="Computer Science">
                </div>

                <div class="input-group">
                    <label>Date *</label>
                    <input type="text" maxlength="50" placeholder="January 2023 - Present">
                </div>
                <div class="input-group">
                    <label>Awards</label>
                    <input type="text" maxlength="200" placeholder="Honour Roll">
                </div>
            
            <div class="input-group">
                <label>Location *</label>
                <input type="text" maxlength="200" placeholder="123 Main St">
            </div>
            </div>
        </div>`
  );
});
addProject.addEventListener("click", () => {
  resumeContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="section-card resume-section" data-type="project">
              <div class="section-header">
                <div class="section-title">
                  <h4>Project</h4>
                </div>
                <div class="section-controls">
                  <label class="must-include">
                    <input type="checkbox" class="must-include-checkbox" />
                    <span class="checkmark"></span>
                    Must Include
                  </label>
                  <button class="remove-section">×</button>
                </div>
              </div>
            <div class="resume-fields-container">
              <div class="resume-fields">
                <div class="input-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    maxlength="150"
                    placeholder="Resume Builder"
                  />
                </div>

                <div class="input-group">
                  <label>Tools *</label>
                  <input
                    type="text"
                    maxlength="200"
                    placeholder="HTML, Git"
                  />
                </div>

                <div class="input-group">
                  <label>Date *</label>
                  <input
                    type="text"
                    maxlength="50"
                    placeholder="January 2023"
                  />
                </div>
                </div>
                <div class="bullet-points">
                                <div class="bullet-point">
                                    <textarea 
                                        placeholder="Describe your project..."
                                        maxlength="300"
                                        rows="2"
                                    ></textarea>
                                    <button class="remove-bullet">×</button>
                                </div>
                            </div>
                            <div class="bullet-limit">1-7 bullet points</div>
                            <button class="add-bullet-btn">
                                <span class="plus-icon">+</span>
                            </button>
            </div>`
  );
});
addExperience.addEventListener("click", () => {
  resumeContainer.insertAdjacentHTML(
    "beforeend",
    `
                        <div class="section-card resume-section" data-type="experience">
                            <div class="section-header">
                                <div class="section-title">
                                    <h4>Experience</h4>
                                </div>
                                <div class="section-controls">
                                    <label class="must-include">
                                        <input type="checkbox" class="must-include-checkbox">
                                        <span class="checkmark"></span>
                                        Must Include
                                    </label>
                                    <button class="remove-section">×</button>
                                </div>
                            </div>
                            
                            <div class="resume-fields">
                                <div class="input-group">
                                    <label>Workplace Name *</label>
                                    <input type="text" maxlength="100" placeholder="Company Name">
                                </div>
                                
                                <div class="input-group">
                                    <label>Job Title *</label>
                                    <input type="text" maxlength="100" placeholder="Software Engineer">
                                </div>
                                
                                <div class="input-group">
                                    <label>Date *</label>
                                    <input type="text" maxlength="50" placeholder="January 2023 - Present">
                                </div>
                            </div>
                            
                            <div class="bullet-points">
                                <div class="bullet-point">
                                    <textarea 
                                        placeholder="Describe your achievement or responsibility..."
                                        maxlength="300"
                                        rows="2"
                                    ></textarea>
                                    <button class="remove-bullet">×</button>
                                </div>
                            </div>
                            <div class="bullet-limit">1-7 bullet points</div>
                            <button class="add-bullet-btn">
                                <span class="plus-icon">+</span>
                            </button>
                            
                        </div>
`
  );
});
addSkills.addEventListener("click", () => {
  resumeContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="section-card resume-section" data-type="skills">
              <div class="section-header">
                <div class="section-title">
                  <h4>Technical Skills</h4>
                </div>
                <div class="section-controls">
                  <label class="must-include">
                    <input type="checkbox" class="must-include-checkbox" />
                    <span class="checkmark"></span>
                    Must Include
                  </label>
                  <button class="remove-section">×</button>
                </div>
              </div>
            <div class="resume-fields-container">
              <div class="resume-fields">
                <div class="input-group">
                  <label>Languages</label>
                  <input
                    type="text"
                    maxlength="500"
                    placeholder="JavaScript, Python"
                  />
                </div>

                <div class="input-group">
                  <label>Tools</label>
                  <input
                    type="text"
                    maxlength="500"
                    placeholder="Python, JavaScript"
                  />
                </div>

                <div class="input-group">
                  <label>Courses</label>
                  <input
                    type="text"
                    maxlength="500"
                    placeholder="Data Structures, Algorithms"
                  />
                </div>
                </div>`
  );
});

addVolunteer.addEventListener("click", () => {
  resumeContainer.insertAdjacentHTML(
    "beforeend",
    `            <div class="section-card resume-section" data-type="volunteer">
              <div class="section-header">
                <div class="section-title">
                  <h4>Volunteer</h4>
                </div>
                <div class="section-controls">
                  <label class="must-include">
                    <input type="checkbox" class="must-include-checkbox" />
                    <span class="checkmark"></span>
                    Must Include
                  </label>
                  <button class="remove-section">×</button>
                </div>
              </div>
              <div class="resume-fields-container">
                <div class="resume-fields">
                  <div class="input-group">
                    <label>Name of Organization *</label>
                    <input
                      type="text"
                      maxlength="500"
                      placeholder="Under The Tree"
                    />
                  </div>
                  <div class="input-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      maxlength="500"
                      placeholder="Organizer"
                    />
                  </div>

                  <div class="input-group">
                    <label>Date *</label>
                    <input
                      type="text"
                      maxlength="500"
                      placeholder="January 2023 - Present"
                    />
                  </div>
                </div>
              </div>
              <div class="bullet-points">
                <div class="bullet-point">
                  <textarea
                    placeholder="Describe your achievement or responsibility..."
                    maxlength="300"
                    rows="2"
                  ></textarea>
                  <button class="remove-bullet">×</button>
                </div>
              </div>
              <div class="bullet-limit">1-7 bullet points</div>
              <button class="add-bullet-btn">
                <span class="plus-icon">+</span>
              </button>
            </div>`
  );
});
