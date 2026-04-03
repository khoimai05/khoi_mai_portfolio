import re

html_path = r'c:\Users\Alan\Desktop\portfolio\khoi_mai_portfolio\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    '<div class="project-card magnetic-card">\n          <img src="./assets/images/antsomi_new.jpg" alt="Antsomi" class="project-image">': 
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [1]:</div>
          <pre><code style="color:#CFB991;">khoi.experience.show('Antsomi')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[1]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/antsomi_new.jpg" alt="Antsomi" class="project-image">''',
              
    '<div class="project-card magnetic-card">\n          <img src="./assets/images/ocb-websosc-heroimg555.webp" alt="OCB" class="project-image">':
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [2]:</div>
          <pre><code style="color:#CFB991;">khoi.experience.show('OCB')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[2]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/ocb-websosc-heroimg555.webp" alt="OCB" class="project-image">''',
              
    '<div class="project-card magnetic-card">\n          <img src="./assets/images/vrai.png" alt="VRAI" class="project-image">':
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [3]:</div>
          <pre><code style="color:#CFB991;">khoi.experience.show('VRAI Lab')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[3]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/vrai.png" alt="VRAI" class="project-image">''',
              
    '<div class="project-card magnetic-card">\n          <img src="./assets/images/dp.jpg" alt="DP" class="project-image">':
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [4]:</div>
          <pre><code style="color:#CFB991;">khoi.experience.show('Discovery Park')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[4]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/dp.jpg" alt="DP" class="project-image">''',

    '<div class="project-card magnetic-card">\n          <img src="./assets/images/microsoft.png" alt="Microsoft Hackathon" class="project-image">':
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [5]:</div>
          <pre><code style="color:#CFB991;">khoi.projects.get('Microsoft Hackathon')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[5]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/microsoft.png" alt="Microsoft Hackathon" class="project-image">''',
              
    '<div class="project-card magnetic-card">\n          <img src="./assets/images/elite-edge.png" alt="Elite Edge Basketball" class="project-image">':
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [6]:</div>
          <pre><code style="color:#CFB991;">khoi.projects.get('Elite Edge')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[6]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/elite-edge.png" alt="Elite Edge Basketball" class="project-image">''',
              
    '<div class="project-card magnetic-card">\n          <img src="./assets/images/playground.png" alt="DS Playground" class="project-image">':
    '''<div class="nb-cell-wrapper">
        <div class="nb-cell">
          <div class="nb-prompt">In [7]:</div>
          <pre><code style="color:#CFB991;">khoi.projects.get('DS Playground')</code></pre>
        </div>
        <div class="nb-cell nb-output">
          <div class="nb-prompt" style="color:rgba(207, 185, 145, 0.4);">Out[7]:</div>
          <div class="nb-output-content jupyter-card-output">
            <div class="project-card magnetic-card">
              <img src="./assets/images/playground.png" alt="DS Playground" class="project-image">'''
}

for k, v in replacements.items():
    if k in html:
        html = html.replace(k, v)
    else:
        print(f"Could not find: {k[:50]}")

html = html.replace('</div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [2]:</div>',
                    '</div></div></div></div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [2]:</div>')

html = html.replace('</div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [3]:</div>',
                    '</div></div></div></div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [3]:</div>')

html = html.replace('</div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [4]:</div>',
                    '</div></div></div></div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [4]:</div>')

html = html.replace('</div>\n      </div>\n    </div>\n\n    <!-- PROJECTS AND HACKATHON SECTION -->',
                    '</div></div></div></div>\n      </div>\n    </div>\n\n    <!-- PROJECTS AND HACKATHON SECTION -->')

html = html.replace('</a>\n        </div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [6]:</div>',
                    '</a>\n        </div></div></div></div>\n\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [6]:</div>')

html = html.replace('</div>\n        </div>\n\n        <!-- <div class="projects-container\"> -->\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [7]:</div>',
                    '</div>\n        </div></div></div></div>\n\n        <!-- <div class="projects-container"> -->\n        <div class="nb-cell-wrapper">\n        <div class="nb-cell">\n          <div class="nb-prompt">In [7]:</div>')

html = html.replace('</a>\n        </div>\n      </div>\n      <!-- </div>  -->\n    </div>\n  </div>\n  </div>\n  <!-- FOOTER -->',
                    '</a>\n        </div></div></div></div>\n      </div>\n      <!-- </div>  -->\n    </div>\n  </div>\n  </div>\n  <!-- FOOTER -->')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
