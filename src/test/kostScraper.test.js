const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getDistance } = require('geolib');
const KostScraper = require('../services/scraper/kosScraper'); // Sesuaikan dengan path yang benar
// Mocking axios untuk scraping data
const mock = new MockAdapter(axios);

describe('KostScraper', () => {
  beforeEach(() => {
    // Mock data untuk scraping Mamikos
    mock.onGet('https://mamikos.com/cari/universitas-ciputra-surabaya-universitas-ciputra-surabaya-made-surabaya-city-east-java-indonesia/all/bulanan/0-15000000?keyword=Universitas%20Ciputra&suggestion_type=search&rent=2&sort=price,-&price=10000-20000000&singgahsini=0').reply(200, `
      <div class="room-list__card">
        <div class="rc-info__name">Kost A</div>
        <div class="rc-info__location">Jalan ABC No. 123, Surabaya</div>
        <div class="rc-overview__availability">Tersedia</div>
        <div data-testid="roomCardFacilities-facility">WiFi</div>
        <div data-testid="roomCardFacilities-facility">AC</div>
        <div class="rc-price__real">
            <span class="rc-price__text">Rp 1.500.000</span>
            <span class="rc-price__type">/bulan</span>
        </div>
        <img data-testid="roomCardCover-photo" src="imageA.jpg" />
      </div>
      <div class="room-list__card">
        <div class="rc-info__name">Kost B</div>
        <div class="rc-info__location">Jalan XYZ No. 456, Surabaya</div>
        <div class="rc-overview__availability">Tersedia</div>
        <div data-testid="roomCardFacilities-facility">WiFi</div>
        <div data-testid="roomCardFacilities-facility">AC</div>
        <div class="rc-price__real">
            <span class="rc-price__text">Rp 2.000.000</span>
            <span class="rc-price__type">/bulan</span>
        </div>
        <img data-testid="roomCardCover-photo" src="imageB.jpg" />
      </div>
    `);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should scrape kost data from Mamikos', async () => {
    const result = await KostScraper.scrapeMamikos();

    // Cek hasil scraping
    expect(result.length).toBe(2); // Pastikan ada 2 kost yang ter-scrape
    expect(result[0].name).toBe('Kost A');
    expect(result[0].location).toBe('Jalan ABC No. 123, Surabaya');

    // Memastikan harga dikonversi dengan benar
    const priceA = result[0].price.value;
    expect(priceA).toBe(1500000); // Pastikan harga Kost A adalah Rp 1.500.000

    expect(result[1].name).toBe('Kost B');
    expect(result[1].location).toBe('Jalan XYZ No. 456, Surabaya');
    const priceB = result[1].price.value;
    expect(priceB).toBe(2000000); // Pastikan harga Kost B adalah Rp 2.000.000
  });

  it('should calculate distances correctly', async () => {
    // Mock data kost dengan koordinat
    const kostData = [
      {
        name: 'Kost A',
        location: 'Jalan ABC No. 123, Surabaya',
        price: { value: 1500000, formatted: 'Rp 1.500.000' },
        coordinates: { latitude: -7.2860459, longitude: 112.6276081 }  // Lokasi UC
      },
      {
        name: 'Kost B',
        location: 'Jalan XYZ No. 456, Surabaya',
        price: { value: 2000000, formatted: 'Rp 2.000.000' },
        coordinates: { latitude: -7.2855000, longitude: 112.6281000 } // Jarak sekitar 117 meter
      }
    ];

    // Test penghitungan jarak
    const result = KostScraper.calculateDistances(kostData);

    // Periksa hasil jarak
    expect(result[0].distanceFormatted).toBe('0 meter');  // Jarak Kost A dengan UC adalah 0 meter
    expect(result[1].distanceFormatted).toBe('0.1 km');  // Jarak Kost B dengan UC seharusnya sekitar 0.1 km
  });
});
