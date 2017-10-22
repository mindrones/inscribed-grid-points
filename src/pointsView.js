import {h} from '@cycle/dom';

export default (points, radius) =>
    h('g.points', points.map(point =>
        h('circle.dot', {
            attrs: {
                cx: point.x,
                cy: point.y,
                r: radius
            }
        })
    ));
