import _ from 'lodash';
import {h} from '@cycle/dom';

export default (grid, width, height) =>
    h('g.grid', _.flatMap(grid, (vertex, direction) => {
            if (direction === 'x') {
                return vertex.map(n =>
                    h('line.x', {
                        attrs: {
                            x1: n,
                            x2: n,
                            y1: 0,
                            y2: height
                        }
                    })
                )
            }
            if (direction === 'y') {
                return vertex.map(n =>
                    h('line.y', {
                        attrs: {
                            x1: 0,
                            x2: width,
                            y1: n,
                            y2: n
                        }
                    })
                )
            }
        })
    );
