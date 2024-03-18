from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/liquidity-pools')
def get_liquidity_pools():
    res = requests
    liquidity_pools_data = [
        {"pool_id": "1", "pair": "RAY/USDC", "liquidity": "1000"},
        {"pool_id": "2", "pair": "SOL/USDC", "liquidity": "500"},
    ]
    return jsonify(liquidity_pools_data)

if __name__ == '__main__':
    app.run(debug=True)