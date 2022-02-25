
function generate()
{
    window.alert("graph will generate");
}

const ctx = document.getElementById('chart').getContext('2d');
const custChart1 = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['2010', '2011', '2012', '2013', '2014'],
        datasets: [{
            label: 'Users Choice',
            data: [100, 234, 200, 400, 70],
            backgroundColor: [
                'rgba(255, 99, 50, 0.7)',
                'rgba(25, 10, 255, 0.7)',
                'rgba(10, 200, 50, 0.7)',
                'rgba(100, 100, 100, 0.7)',
                'rgba(150, 0, 150, 0.7)',
            ],
            borderColor: [
                'rgb(0,0,0)'

            ],
            borderWidth: 1.5
        }]
    }
});