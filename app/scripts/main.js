$('#res-dropdownbttn').on('click', function() {
	$('.navidropdown').slideUp();
	$('#res-dropdown').slideDown();
});
$('#port-dropdownbttn').on('click', function() {
	$('.navidropdown').slideUp();
	$('#port-dropdown').slideDown();
});




$('.skill_icon_container').on('click', function() {
	$('.skillinfo').css('display', 'block');
});
$('.accordion-title').on('click', function() {
	var content = '#' + this.id + '-content';
	$('.accordion-content').slideUp();
	$(content).slideDown();
	
	var img = '#' + this.id + '-img';
	$('.accordion-img').slideUp();
	$(img).slideDown();
});
$('#contact').on('click', function() {
	$('#contact-div').slideDown();	
});
$('#closebttn').on('click', function() {
	$('#contact-div').slideUp();
});
	

$('body').keydown(function(e) {
	e.preventDefault();
	// get current slide
	var current = $('.flex--active').data('slide');
	var next;
	
	// determine the keypress
	if ((e.which === 34) || (e.which === 39) || (e.which === 40)){//up	
		if (current == 7) {
			next = $('.first').data('slide');
		}
		else {
			next = $('.flex--active').next().data('slide');	
		}
		runSlides(next);		
	}
	if ((e.which === 33) || (e.which === 37) || (e.which === 38)) { //down
		if (current == 1) {
			next = $('.last').data('slide');
		}
		else {
			next = $('.flex--active').prev().data('slide');	
		}
		runSlides(next);			
	}
	if ( ((current == 4) && (next == 5)) || ((current == 1) && (next == 7)) ) { //going from my story to my work
		$('.navidropdown').slideUp();
		$('#port-dropdown').slideDown();
	}
	if ( ((current == 7) && (next == 1)) || ((current == 5) && (next == 4)) ) { //going from work to story
		$('.navidropdown').slideUp();
		$('#res-dropdown').slideDown();
	}
});

$('.slide-nav').on('click', function(e) {
	e.preventDefault();
	// get current data-slide the user is viewing
	var current = $('.flex--active').data('slide');
	// get button data-slide the user is going to/ clicked on: data is the slide number
	if ($(this).data('slide') == '999') { var next = '11'; }
	else { var next = $(this).data('slide'); }

	if (current === next) {
		return false;
	} else {
		runSlides(next);
	}
});	


function runSlides (next) {
	$('.slider__wrapper').find('.flex__container[data-slide=' + next + ']').addClass('flex--preStart');
			$('.flex--active').addClass('animate--end');
			setTimeout(function() {
				$('.flex--preStart').removeClass('animate--start flex--preStart').addClass('flex--active');
				$('.animate--end').addClass('animate--start').removeClass('animate--end flex--active');
			}, 800);
	
}

/***    D3 CIRCLE DIAGRAM    **/



if (screen.height <= 767) {  // up to 568
	var width = 284;
	var height = 227;
}
else if (screen.height <= 799) {  // up to 768
	var width = 384;
	var height = 307;
}
else if (screen.height <= 1079) {  // up to 800
	var width = 400;
	var height = 320;
}
else {						//1080 and over
	var width = 540;
	var height = 432;
}

var radius = Math.min(width, height) / 2;

// Mapping of step names to colors.
var colors = {
  'Adobe': '#A78BC6', //purple
  'Software': '#0089BF', //blue
  'Files': '#90EED8', //blue
  'Content': '#80C5DF', //blue
  'Microsoft': '#21DDB1', //blue
  'Coding': '#AFE261', //green
  'Languages': '#A7F1B0', //green
  'Framework': '#90EED8', //lblue
  'Skill': '#ffe7dd'
};

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select('#chart').append('svg:svg')
    .attr('width', width)
    .attr('height', height)
    .append('svg:g')
    .attr('id', 'container')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

var partition = d3.partition()
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

// Use d3.text and d3.csvParseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text('data.csv', function(text) {
  var csv = d3.csvParseRows(text);
  var json = buildHierarchy(csv);
  createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append('svg:circle')
      .attr('r', radius)
      .style('opacity', 0);

  // Turn the data into a d3 hierarchy and calculate the sums.
  var root = d3.hierarchy(json)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });
  
  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition(root).descendants()
      .filter(function(d) {
          return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll('path')
      .data(nodes)
      .enter().append('svg:path')
      .attr('display', function(d) { return d.depth ? null : 'none'; })
      .attr('d', arc)
      .attr('fill-rule', 'evenodd')
      .style('fill', function(d) { 
			if (!colors[d.data.name]) {return colors['Skill'];}
			else {return colors[d.data.name];}
		})
      .style('opacity', 1)
      .on('mouseover', mouseover);

  // Add the mouseleave handler to the bounding circle.
  d3.select('#container').on('mouseleave', mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.datum().value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var skillName = d.data.name;
	console.log(skillName);
	
	d3.select('#skillName')
		.text(skillName);
		
	d3.select('#displaySkill')
		.style('visibility', '');

  var sequenceArray = d.ancestors().reverse();
  sequenceArray.shift(); // remove root node from the array

  // Fade all the segments.
  d3.selectAll('path')
      .style('opacity', 0.5);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll('path')
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style('opacity', 1); 
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Deactivate all segments during transition.
  d3.selectAll('path').on('mouseover', null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll('path')
      .transition()
      .duration(1000)
      .style('opacity', 1)
      .on('end', function() {
              d3.select(this).on('mouseover', mouseover);
            });

  d3.select('#displaySkill')
      .style('visibility', 'hidden');
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {'name': 'root', 'children': []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split('-');
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode['children'];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]['name'] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {'name': nodeName, 'children': []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {'name': nodeName, 'size': size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
