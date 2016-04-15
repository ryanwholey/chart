import d3 from 'd3';
import c3 from 'c3';
import $ from 'jquery';

import serializeWithStyles from './serializeWithStyles';

'use strict';


c3.generate({
    data: {
        columns: [
            ['data1', 300, 350, 300, 0, 0, 120],
            ['data2', 130, 100, 140, 200, 150, 50]
        ],
        types: {
            data1: 'area-step',
            data2: 'area-step'
            // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
        },
        groups: [['data1', 'data2']]
    },
    bindto:'.chart'
});


const handleDownload = (e) => {
  e.preventDefault();
  downloadImage();
};

const downloadImage = () => {
  let serialize = serializeWithStyles(),
      $svg = $('svg'),
      html,
      imgsrc,
      img,
      canvas,
      context;

  d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg");

  serialize($svg[0])
    .then((h) => {
      html = h;


      imgsrc = `data:image/svg+xml;base64,${btoa(html)}`;
      img = new Image();

      img.src = imgsrc;

      canvas = document.createElement('canvas');
      canvas.width = $svg.width();
      canvas.height = $svg.height();

      context = canvas.getContext('2d');


      img.onload = function(canvas,context,e) {
        let a;

        context.drawImage(img, 0, 0);

        a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'chart.png';
        document.body.appendChild(canvas);
        // a.click();

      }.bind(this, canvas, context);


    })
}
$('.download').on('click', handleDownload);