export class GraphicsService {

    #generateData(graphicTitle, labels, data, colors = []) {
        if (colors.length > 0) {
            return {
                labels: labels,
                datasets: [{
                    label: graphicTitle,
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            }
        }
        return {
            labels: labels,
            datasets: [{
                label: graphicTitle,
                data: data,
                borderWidth: 1
            }]
        }
    }


    createPieGraphic(component, graphicTitle, labels, data, colors = []) {
        const generatedData = this.#generateData(graphicTitle, labels, data, colors);
        return new Chart(component, {
            type: 'pie',
            data: generatedData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                            },
                        },
                    },
                },
            },
        });
    }

    createBarGraphic(component, graphicTitle, labels, data, colors = []) {

        const generatedData = this.#generateData(graphicTitle, labels, data, colors);
        return new Chart(component, {
            type: 'bar',
            data: generatedData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
            },
        });
    }

}