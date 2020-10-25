class Executive {
	constructor() {
		// Initialize drag-and-drop
		REDIPS.drag.dropMode = "single";
		REDIPS.drag.event.dropped = targetCell => {
			console.log(targetCell);
			let course = this.plan.course_id_to_object(targetCell.firstElementChild.dataset["course"]);
			let new_x = targetCell.dataset["x"];
			let new_y = targetCell.dataset["y"];
			this.plan.remove_course(course);
			this.plan.semesters[new_y].add_course(course, new_x);
			this.renderArrows();
		};

		this.render = new Render(3, 4); // TODO hard-coded rows/cols
		this.createTestPlan();
		this.renderCourseGrid();
	}

	createTestPlan() {
		this.plan = new Plan("Computer Science", FALL, 2018);
		this.plan.semesters[0].semester_courses[1] = this.plan.course_id_to_object("EECS 168");
		this.plan.semesters[0].semester_courses[2] = this.plan.course_id_to_object("EECS 140");
		this.plan.semesters[1].semester_courses[1] = this.plan.course_id_to_object("MATH 526");
		this.plan.semesters[1].semester_courses[3] = this.plan.course_id_to_object("GE 2.2");
		this.plan.semesters[2].semester_courses[0] = this.plan.course_id_to_object("EECS 268");
		this.plan.semesters[2].semester_courses[1] = this.plan.course_id_to_object("PHSX 210");
		this.plan.semesters[2].semester_courses[2] = this.plan.course_id_to_object("EECS 388");
		this.plan.semesters[2].semester_courses[3] = this.plan.course_id_to_object("PHSX 216");
	}

	// Redrawing the course grid should only be needed after drastic changes (e.g. removing a semester)
	// The rest of the time, the users takes care of these steps by moving courses around
	renderCourseGrid() {
		let grid = document.getElementById("course-grid");
		// Clear grid
		while (grid.firstChild) grid.removeChild(grid.firstChild);

		let cols = this.plan.get_longest()+1; // +1 leaves an empty column to add another course to a semester
		for (let i = 0; i < this.plan.semesters.length; i++) {
			let semester = this.plan.semesters[i];
			let tr = document.createElement("tr");

			let th = document.createElement("th");
			th.className = "redips-mark";
			th.innerText = semester.semester_year + " " + semester.season_name();
			tr.appendChild(th);

			for (let j = 0; j < cols; j++) {
				let td = document.createElement("td");
				if (semester.semester_courses[j] != undefined) {
					td.innerHTML = semester.semester_courses[j].to_html();
				}
				td.dataset["x"] = j;
				td.dataset["y"] = i;
				tr.appendChild(td);
			}

			grid.appendChild(tr);
		}
		REDIPS.drag.init(); // Updates which elements have drag-and-drop
		this.render.resize(this.plan.semesters.length, cols);

		this.renderArrows(); // Will always need to render arrows after rendering course grid
	}

	renderArrows() {
		// TODO: Create list of arrows to draw either here or from a function in Plan.js

		// Test arrows from and to hard-coded course positions
		this.render.renderArrows(this.plan.generate_arrows());
	}
}
