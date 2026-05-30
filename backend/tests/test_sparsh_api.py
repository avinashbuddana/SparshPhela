"""Sparsh Pehla backend API tests - public content, auth, and admin protected routes."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sparsh-pehla-preview.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@sparshpehla.com"
ADMIN_PASSWORD = "SparshAdmin@2026"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(client):
    r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["email"] == ADMIN_EMAIL
    return data["token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---------------------- PUBLIC CONTENT ----------------------
class TestPublicContent:
    def test_services_list(self, client):
        r = client.get(f"{API}/services")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 14, f"expected 14 services, got {len(data)}"
        first = data[0]
        assert "slug" in first and "id" in first and "_id" not in first

    def test_service_detail_known_slug(self, client):
        services = client.get(f"{API}/services").json()
        slug = services[0]["slug"]
        r = client.get(f"{API}/services/{slug}")
        assert r.status_code == 200
        assert r.json()["slug"] == slug

    def test_service_detail_garbh_sanskar(self, client):
        r = client.get(f"{API}/services/garbh-sanskar")
        # may or may not exist depending on seed; if 404 still acceptable but log
        assert r.status_code in (200, 404)

    def test_service_detail_404(self, client):
        r = client.get(f"{API}/services/nonexistent-xyz")
        assert r.status_code == 404

    def test_blogs_list(self, client):
        r = client.get(f"{API}/blogs")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6, f"expected >=6 blogs, got {len(data)}"

    def test_blogs_category_filter(self, client):
        cats = client.get(f"{API}/blogs/categories").json()
        assert isinstance(cats, list) and len(cats) > 0
        c = cats[0] if cats[0] != "All" else (cats[1] if len(cats) > 1 else cats[0])
        r = client.get(f"{API}/blogs", params={"category": c})
        assert r.status_code == 200
        for b in r.json():
            assert b["category"] == c

    def test_blogs_search(self, client):
        all_blogs = client.get(f"{API}/blogs").json()
        if not all_blogs:
            pytest.skip("no blogs to search")
        term = all_blogs[0]["title"].split()[0]
        r = client.get(f"{API}/blogs", params={"search": term})
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_blog_detail_with_related(self, client):
        blogs = client.get(f"{API}/blogs").json()
        slug = blogs[0]["slug"]
        r = client.get(f"{API}/blogs/{slug}")
        assert r.status_code == 200
        body = r.json()
        assert body["slug"] == slug
        assert "related" in body and isinstance(body["related"], list)

    def test_testimonials(self, client):
        r = client.get(f"{API}/testimonials")
        assert r.status_code == 200
        assert len(r.json()) >= 6

    def test_faqs(self, client):
        r = client.get(f"{API}/faqs")
        assert r.status_code == 200
        assert len(r.json()) >= 6

    def test_gallery(self, client):
        r = client.get(f"{API}/gallery")
        assert r.status_code == 200
        assert len(r.json()) >= 12

    def test_gallery_category_filter(self, client):
        items = client.get(f"{API}/gallery").json()
        if not items:
            pytest.skip("no gallery")
        cat = items[0].get("category")
        if not cat:
            pytest.skip("no category field")
        r = client.get(f"{API}/gallery", params={"category": cat})
        assert r.status_code == 200
        for it in r.json():
            assert it["category"] == cat

    def test_media_hero(self, client):
        r = client.get(f"{API}/media/hero", allow_redirects=False)
        assert r.status_code in (200, 302, 307)
        if r.status_code == 200:
            assert r.headers.get("content-type", "").startswith("image/")


# ---------------------- FORM SUBMISSIONS ----------------------
class TestForms:
    def test_inquiry_submission(self, client):
        r = client.post(f"{API}/inquiries", json={
            "name": "TEST_User",
            "email": "test_inquiry@example.com",
            "phone": "1234567890",
            "service": "Garbh Sanskar",
            "message": "TEST inquiry"
        })
        assert r.status_code == 200, r.text
        assert "id" in r.json()

    def test_booking_submission(self, client):
        r = client.post(f"{API}/bookings", json={
            "name": "TEST_User",
            "email": "test_booking@example.com",
            "phone": "1234567890",
            "service": "Garbh Sanskar",
            "preferred_date": "2026-02-15",
            "preferred_time": "10:00 AM",
            "message": "TEST booking"
        })
        assert r.status_code == 200
        assert "id" in r.json()

    def test_newsletter_idempotent(self, client):
        email = "test_news_idem@example.com"
        r1 = client.post(f"{API}/newsletter", json={"email": email})
        assert r1.status_code == 200
        r2 = client.post(f"{API}/newsletter", json={"email": email})
        assert r2.status_code == 200
        assert "already" in r2.json()["message"].lower() or "subscribed" in r2.json()["message"].lower()


# ---------------------- AUTH ----------------------
class TestAuth:
    def test_login_valid(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert "token" in d and isinstance(d["token"], str)
        assert d.get("role") == "admin"

    def test_login_invalid(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_token(self, client, auth_headers):
        r = client.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_token(self, client):
        # Use fresh requests to avoid session cookies
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_logout(self, client, auth_headers):
        r = client.post(f"{API}/auth/logout", headers=auth_headers)
        assert r.status_code == 200


# ---------------------- ADMIN PROTECTED ----------------------
class TestAdmin:
    def test_stats_requires_auth(self):
        r = requests.get(f"{API}/admin/stats")
        assert r.status_code == 401

    def test_stats_with_auth(self, client, auth_headers):
        r = client.get(f"{API}/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["inquiries", "bookings", "blogs", "services", "testimonials", "subscribers"]:
            assert k in d

    def test_admin_inquiries(self, client, auth_headers):
        r = client.get(f"{API}/admin/inquiries", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_bookings(self, client, auth_headers):
        r = client.get(f"{API}/admin/bookings", headers=auth_headers)
        assert r.status_code == 200

    def test_admin_newsletter(self, client, auth_headers):
        r = client.get(f"{API}/admin/newsletter", headers=auth_headers)
        assert r.status_code == 200

    def test_patch_inquiry_status(self, client, auth_headers):
        # create then patch
        c = client.post(f"{API}/inquiries", json={
            "name": "TEST_Patch", "email": "tpatch@example.com", "message": "x"
        })
        iid = c.json()["id"]
        r = client.patch(f"{API}/admin/inquiries/{iid}", headers=auth_headers, json={"status": "resolved"})
        assert r.status_code == 200
        # verify
        all_inq = client.get(f"{API}/admin/inquiries", headers=auth_headers).json()
        match = [x for x in all_inq if x["id"] == iid]
        assert match and match[0]["status"] == "resolved"
        # cleanup
        client.delete(f"{API}/admin/inquiries/{iid}", headers=auth_headers)

    def test_patch_booking_status(self, client, auth_headers):
        c = client.post(f"{API}/bookings", json={
            "name": "TEST_Patch", "email": "tbpatch@example.com",
            "phone": "1", "service": "X"
        })
        bid = c.json()["id"]
        r = client.patch(f"{API}/admin/bookings/{bid}", headers=auth_headers, json={"status": "confirmed"})
        assert r.status_code == 200
        client.delete(f"{API}/admin/bookings/{bid}", headers=auth_headers)

    def test_generic_crud_testimonial(self, client, auth_headers):
        # create
        payload = {"name": "TEST_T", "role": "Mom", "quote": "great", "rating": 5}
        c = client.post(f"{API}/admin/testimonials", headers=auth_headers, json=payload)
        assert c.status_code == 200, c.text
        tid = c.json()["id"]
        # update
        u = client.put(f"{API}/admin/testimonials/{tid}", headers=auth_headers, json={"name": "TEST_T2", "quote": "great", "rating": 5})
        assert u.status_code == 200
        assert u.json()["name"] == "TEST_T2"
        # delete
        d = client.delete(f"{API}/admin/testimonials/{tid}", headers=auth_headers)
        assert d.status_code == 200

    def test_generic_crud_unknown_collection(self, client, auth_headers):
        r = client.post(f"{API}/admin/unknown", headers=auth_headers, json={"x": 1})
        assert r.status_code == 404
