import networkx as nx
import matplotlib.pyplot as plt
from flask import Flask, request, abort, send_from_directory
import json

app = Flask(__name__)
graphFileName = "assets/python/Graph.jpeg"

class GraphVisualization:
    def __init__(self, edges):
        self.edges = edges
          
    def buildGraphAndSaveItsImage(self):
        G = nx.Graph()
        G.add_edges_from(self.edges)
        nx.draw_networkx(G)
        plt.savefig(graphFileName, format="jpeg")
        plt.clf()

@app.route('/get-tree', methods=['POST'])
def getTree():
    if request.method == 'POST':
        vertexes = request.json['vertexes']
        formattedVertexes = [[v['id'], v['parent']] for v in vertexes]
        G = GraphVisualization(formattedVertexes)
        G.buildGraphAndSaveItsImage()
        return send_from_directory(directory='', path=graphFileName, as_attachment=True)
    else:
        abort(404)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)