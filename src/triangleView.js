import {h} from '@cycle/dom';

export default (triangle, verticesRadius) =>
    h('g.triangle', [
        // sides
        ...triangle.map((vertex, i, triangle) => {
            const vertex2 = triangle[i + 1] || triangle [0];
            return h('line', {
                attrs: {
                    x1: vertex.x,
                    y1: vertex.y,
                    x2: vertex2.x,
                    y2: vertex2.y,
                    class: vertex.y === vertex2.y ? 'horizontal' : null
                }
            })
        }),

        // verts
        ...triangle.map((vertex, index) =>
            h('g', [
                h('circle.vertex', {
                    attrs: {
                        cx: vertex.x,
                        cy: vertex.y,
                        r: verticesRadius
                    }
                }),
                // h('text', {
                //     attrs: {
                //         x: vertex.x,
                //         y: vertex.y,
                //     }
                // }, [`${index}`])
            ])
        )
    ]);
