from pyaadhaar.decode import AadhaarSecureQr
from pyaadhaar.utils import Qr_img_to_text
import sys, json

# Use hardcoded path or accept from command line
img_path = sys.argv[1]

try:
    qr_data_list = Qr_img_to_text(img_path)

    if isinstance(qr_data_list, list):
        qr_data = qr_data_list[0]  # Take the first result
    else:
        qr_data = qr_data_list

    qr = AadhaarSecureQr(qr_data)
    decoded = qr.decodeddata()

    result = {
        "verified": True,
        "name": decoded.name,
        "dob": decoded.dob,
        "uid": decoded.uid,
        "gender": decoded.gender,
        "mobile": decoded.mobile,
        "email": decoded.email,
        "photo": decoded.photo
    }

except Exception as e:
    result = { "verified": False, "error": str(e) }

print(json.dumps(result, indent=2))
