let G = {
    V: [[100, 200],  // vertex 0 coordinates on canvas
        [260, 100],  // vertex 1
        [260, 300],  // vertex 2
        [420, 200],  // vertex 3
    ],
    E: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]]  // edges
};

const GraphExample = function(s) {
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');    // loads font (Times new roman)
    };
    s.setup = function () {
        // this sets frameRate to be 30, and creates a canvas of 1200 by 675 (you can adjust these in globals.js)
        setup2D(s); 
        
        // creates an undirected graph
        s.g = new Graph_U(s, {  // parameters are passed in via an object
            V: G.V, 
            E: G.E, 
            font: tnr,
            start: 40,   // the time to start the animation in frames
            color_e: [7, 97, 7],   // color of edges in RGB
            color_v: Yellow,   // set color of nodes, using the global Yellow variable
        });
    };
    s.draw = function () {
        s.background(0);
        s.g.show();  // Manim.js classes usually define a show() function to be called in draw()
    };
};

let p = new p5(GraphExample);   // creates the p5 object to render the animation